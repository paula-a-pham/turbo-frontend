import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotFooterComponent } from './bot-footer.component';

describe('BotFooterComponent', () => {
  let component: BotFooterComponent;
  let fixture: ComponentFixture<BotFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BotFooterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BotFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
