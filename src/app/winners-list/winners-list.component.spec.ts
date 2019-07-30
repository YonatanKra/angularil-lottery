import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WinnersListComponent } from './winners-list.component';

describe('WinnersListComponent', () => {
  let component: WinnersListComponent;
  let fixture: ComponentFixture<WinnersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WinnersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WinnersListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe(`init`, () => {
    it(`should show a list of names and emails`, () => {
      component.winners = [
        {
          name: 'someName1', email: 'someEmail1'
        },
        {
          name: 'someName2', email: 'someEmail2'
        }
      ];

      fixture.detectChanges();
      const elements = fixture.nativeElement.querySelectorAll('.winnner-row');
      expect(elements.length).toEqual(2);
      expect(elements[0].innerText).toEqual(`someName1
      someEmail1`);
    });
  });
});
