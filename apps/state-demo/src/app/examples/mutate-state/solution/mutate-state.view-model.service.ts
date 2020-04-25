import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { merge, Observable, Subject, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DemoBasicsItem } from '../mutate-state-item.interface';

export interface DemoBasicsBaseModel {
  refreshInterval: number;
  list: DemoBasicsItem[];
  listExpanded: boolean;
  isPending: boolean;
}

export interface DemoBasicsView {
  refreshClicks: Subject<Event>;
  listExpandedChanges: Subject<boolean>;
  baseModel$: Observable<DemoBasicsBaseModel>;
}

const initState: DemoBasicsBaseModel = {
  refreshInterval: 1000,
  listExpanded: true,
  isPending: true,
  list: []
};

@Injectable()
export class MutateStateViewModelService extends RxState<DemoBasicsBaseModel>
  implements DemoBasicsView {
  baseModel$ = this.select();

  refreshClicks = new Subject<Event>();
  listExpandedChanges = new Subject<boolean>();

  refreshListSideEffect$ = merge(
    this.refreshClicks,
    this.select(map(s => s.refreshInterval)).pipe(switchMap(ms => timer(ms)))
  );

  constructor() {
    super();
    this.set(initState);

    this.connect(
      this.listExpandedChanges.pipe(map(b => ({ listExpanded: b })))
    );
  }
}
