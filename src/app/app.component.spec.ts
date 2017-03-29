import { TestBed, async, tick, fakeAsync, ComponentFixture} from '@angular/core/testing';
import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FakeProductService, PRODUCTS } from './services/testing/fake-product.service';
import { addMatchers, newEvent, Router, RouterStub} from '../testing';
import { ProductService } from './services/product.service';
import {  } from './services';
import { ServicesModule } from './services/services.module';

import { AppComponent } from './app.component';

let comp: AppComponent;
let fixture: ComponentFixture<AppComponent>;
let page: Page;

describe('AppComponent', () => {
  beforeEach(async(() => {
    addMatchers();
    TestBed.configureTestingModule({
      imports: [ServicesModule],
      declarations: [
        AppComponent
      ],
      providers: [
        
      ]
    }).overrideComponent(AppComponent, {
      set: {
        providers: [
          {provide: ProductService, useClass: FakeProductService}
        ]
      }
    })
    
    .compileComponents()
    .then(createComponent);
  }));

  it ('should display correct title', () => {
    const title = page.title.textContent;
    expect(title).toEqual(comp.title);
  });

  it ('should display products', () => {
    expect(page.productRows.length).toBeGreaterThan(0);
  });

  it ('1st hero should match 1st test hero', () => {
    const expectedProduct = PRODUCTS[0];
    const actualProduct = page.productRows[0].textContent;
    expect(actualProduct).toContain(expectedProduct.productId, 'product.productId');
    expect(actualProduct).toContain(expectedProduct.description, 'product.description');
  })

});

/////////// Helpers /////

/** Create the component and set the `page` test variables */
function createComponent() {
  fixture = TestBed.createComponent(AppComponent);
  comp = fixture.componentInstance;

  // change detection triggers ngOnInit which gets a hero
  fixture.detectChanges();
  
  return fixture.whenStable().then(() => {
    // got the products and updated component
    // change detection updates the view
    fixture.detectChanges();
    page = new Page();
  });
}


class Page {
  /**
   * Product line Elements
   */
  productRows: HTMLLIElement[];
  title: HTMLElement;

  constructor() {
    this.title = fixture.debugElement.query(By.css('h1')).nativeElement;
    this.productRows = fixture.debugElement.queryAll(By.css('li')).map(de => de.nativeElement);
  }

}