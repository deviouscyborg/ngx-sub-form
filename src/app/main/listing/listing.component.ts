import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ListingType, OneListing } from 'src/app/interfaces/listing.interface';
import { ListingService } from 'src/app/services/listing.service';
import { ActivatedRoute } from '@angular/router';
import { map, takeUntil, tap, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss'],
})
export class ListingComponent implements OnInit, OnDestroy {
  public onDestroy$ = new Subject<void>();

  public ListingType = ListingType;

  public selectListingType: FormControl = new FormControl();

  public listingForm: FormGroup = new FormGroup({
    listing: new FormControl(null, { validators: [Validators.required] }),
  });

  constructor(private route: ActivatedRoute, private listingService: ListingService) {}

  public ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map(params => params.get('listingId')),
        takeUntil(this.onDestroy$),
        switchMap(listingId => this.listingService.getOneListing(listingId)),
        tap(listing => {
          this.listingForm.get('listing').patchValue(listing);
          this.selectListingType.patchValue(listing.listingType);
        }),
      )
      .subscribe();
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  public upsertListing(listing: OneListing): void {
    this.listingService.upsertListing(listing);
  }
}
