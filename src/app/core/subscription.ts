import { Component, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

@Component({
    template: ''
  })

export class AbstractSubscription implements OnDestroy {
    
    /** List of Subscriptions */
    subscriptions: Subscription[] = [];

    /**
     * Destroy component
     * Unsubscribes from all its observables.
     */
    ngOnDestroy() {
        this.subscriptions.forEach( sub => sub.unsubscribe() );
    }
}