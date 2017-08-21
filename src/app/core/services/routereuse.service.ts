import { DetachedRouteHandle, RouterStateSnapshot, ActivatedRouteSnapshot, RouteReuseStrategy } from '@angular/router';

export class RoutereuseService extends RouteReuseStrategy {

    handlers: { [key: string]: DetachedRouteHandle } = {};

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        //console.log('CustomReuseStrategy:shouldDetach', route);

        return !!route.data && !!(route.data as any).shouldDetach;
        // return true; 
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        console.log('CustomReuseStrategy:store', route, handle);
        this.handlers[route.routeConfig.path] = handle;
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        //console.log('CustomReuseStrategy:shouldAttach', route);

        return !!route.routeConfig && !!this.handlers[route.routeConfig.path];
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        //console.log('CustomReuseStrategy:retrieve', route);
        if (!route.routeConfig) return null;
        return this.handlers[route.routeConfig.path];
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {

        console.log('test');
    
        let nameFuture = future.component && (<any>future.component).name;
   


        return future.routeConfig === curr.routeConfig;
       


    }

}
