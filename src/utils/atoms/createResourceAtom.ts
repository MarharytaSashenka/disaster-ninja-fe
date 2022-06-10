import { isObject } from '@reatom/core';
import type { Atom, AtomSelfBinded, Action } from '@reatom/core';
import { createAtom } from '~utils/atoms/createPrimitives';

export type ResourceAtom<P, T> = AtomSelfBinded<
  ResourceAtomState<T, P>,
  {
    request: (params?: P | undefined) => T | undefined;
    refetch: () => undefined;
    done: (data: T) => P;
    error: (error: string) => string;
    finally: () => null;
  }
>;

interface ResourceAtomState<T, P> {
  loading: boolean;
  error: string | null;
  data: T | null;
  canceled: boolean;
  lastParams: P | null;
}

type FetcherFunc<P, T> = (params?: P | null) => Promise<T>;
type FetcherProcessor<T> = () => Promise<T>;
type FetcherCanceller = () => void;
type FetcherFabric<P, T> = (
  params?: P | null,
) => [FetcherProcessor<T>, FetcherCanceller];

type ResourceCtx<P> = {
  version?: number;
  lastParams?: P | null;
  _refetchable?: boolean;
  canceller?: FetcherCanceller;
};

function createResourceFetcherAtom<P, T>(
  fetcher: FetcherFunc<P, T> | FetcherFabric<P, T>,
  name: string,
): ResourceAtomType<P, T> {
  return createAtom(
    {
      request: (params: P | null) => params,
      refetch: () => undefined,
      done: (data: T) => data,
      error: (error: string) => error,
      cancel: () => undefined,
      loading: () => undefined,
      finally: () => null,
    },
    (
      { onAction, schedule, create },
      state: ResourceAtomState<T, P> = {
        loading: false,
        data: null,
        error: null,
        canceled: false,
        lastParams: null,
      },
    ) => {
      const newState = { ...state };

      onAction('request', (params) => {
        newState.lastParams = params ? { ...params } : params;
        newState.loading = true;
        newState.error = null;
        newState.canceled = false;

        schedule(async (dispatch, ctx: ResourceCtx<P>) => {
          const version = (ctx.version ?? 0) + 1;
          ctx._refetchable = true;
          ctx.version = version;
          ctx.lastParams = params; // explicit set that request no have any parameters

          // cancel previous request if we have a special function for it
          if (ctx.canceller) {
            ctx.canceller();
            ctx.canceller = undefined;
          }

          let requestAction: Action | null = null;
          try {
            let response: T;
            const fetcherResult =
              params === undefined ? fetcher() : fetcher(params);
            if (Array.isArray(fetcherResult)) {
              const [processor, canceller] = fetcherResult;
              ctx.canceller = canceller;
              response = await processor();
            } else {
              response = await fetcherResult;
            }
            if (ctx.version === version) {
              if (ctx.canceller) {
                ctx.canceller = undefined;
              }

              requestAction = create('done', response);
            }
          } catch (e) {
            console.error(`[${name}]:`, e);
            if (ctx.version === version) {
              requestAction = create('error', e.message ?? e ?? true);
            }
          } finally {
            if (requestAction) {
              dispatch([requestAction, create('finally')]);
            }
          }
        });
      });

      // Force refetch, usefull for polling
      onAction('refetch', () => {
        schedule((dispatch, ctx: ResourceCtx<P>) => {
          if (ctx._refetchable === false) {
            console.error(`[${name}]:`, 'Do not call refetch before request');
            return;
          }
          dispatch(create('request', ctx.lastParams as P | null));
        });
      });

      onAction('loading', () => {
        newState.loading = true;
        newState.error = null;
        newState.canceled = false;
      });

      onAction('cancel', () => {
        newState.loading = false;
        newState.error = null;
        newState.canceled = true;
        newState.data = null;
      });

      onAction('error', (error) => (newState.error = error));
      onAction('done', (data) => (newState.data = data));
      onAction('finally', () => (newState.loading = false));

      // Significant reduce renders count
      // Replace it with memo decorator if it cause of bugs
      return state.loading === true && newState.loading === true
        ? state
        : newState;
    },
    name,
  );
}

/**
 * You can chain this resources!
 * The demo:
 * https://codesandbox.io/s/reatom-resource-atom-complex-qwi3h
 */

export type ResourceAtomType<P, T> = AtomSelfBinded<
  ResourceAtomState<T, P>,
  {
    request: (params: P | null) => P | null;
    refetch: () => undefined;
    done: (data: T) => T;
    error: (error: string) => string;
    cancel: () => undefined;
    loading: () => undefined;
    finally: () => null;
  }
>;

let resourceAtomIndex = 0;

export function createResourceAtom<P, T>(
  fetcher: FetcherFunc<P, T> | FetcherFabric<P, T>,
  paramsAtom?: Atom<P> | ResourceAtom<any, any> | null,
  name = `Resource-${resourceAtomIndex++}`,
): ResourceAtomType<P, T> {
  const resourceFetcherAtom = createResourceFetcherAtom<P, T>(fetcher, name);

  if (paramsAtom) {
    const autoFetchAtom = createAtom(
      { paramsAtom },
      ({ onChange, schedule }) => {
        onChange('paramsAtom', (newParams) => {
          schedule((dispatch) => {
            if (isObject(newParams)) {
              // Check states than we can be escalated
              if ('canceled' in newParams && newParams.canceled) {
                dispatch(resourceFetcherAtom.cancel());
                return;
              }
              if ('loading' in newParams && newParams.loading) {
                dispatch(resourceFetcherAtom.loading());
                return;
              }
              if ('error' in newParams && newParams.error !== null) {
                dispatch([
                  resourceFetcherAtom.error(newParams.error),
                  resourceFetcherAtom.finally(),
                ]);
                return;
              }
              if ('data' in newParams) {
                dispatch(resourceFetcherAtom.request(newParams.data));
                return;
              }
            }
            // If not, just pass data to fetcher
            dispatch(resourceFetcherAtom.request(newParams));
          });
        });
      },
    );
    // Start after core modules loaded
    setTimeout(() => {
      autoFetchAtom.subscribe(() => null);
    });
  }
  return resourceFetcherAtom;
}
