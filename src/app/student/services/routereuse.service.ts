import { DetachedRouteHandle, RouterStateSnapshot } from '@angular/router';
import { RouteReuseStrategy, ActivatedRouteSnapshot } from "@angular/router/";

export class RoutereuseService extends RouteReuseStrategy {

    handlers: { [key: string]: DetachedRouteHandle } = {};

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        //console.log('CustomReuseStrategy:shouldDetach', route);

  


        return !!route.data && !!(route.data as any).shouldDetach;
        // return true; 
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        //console.log('CustomReuseStrategy:store', route, handle);
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
        //console.log('CustomReuseStrategy:shouldReuseRoute', future, curr);

       



        let nameFuture = future.component && (<any>future.component).name;
        // //let nameCurr = curr.component && (<any>curr.component).name;
        // // //return false;
        // // console.log(name);
        // if (nameFuture === 'StudentComponent') {

        // //   return false;
        // if (nameFuture == 'ListComponent') 
        // {
        //     return true;
        // } 

        // else {
        //   return future.routeConfig === curr.routeConfig;
        // }




        return future.routeConfig === curr.routeConfig;
        // return false


    }

}
