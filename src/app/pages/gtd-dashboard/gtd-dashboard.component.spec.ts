import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { GtdDashboardComponent } from './gtd-dashboard.component';
import { selectAllTasksInActiveProjects } from '../../features/tasks/store/task.selectors';
import { selectUnarchivedProjects } from '../../features/project/store/project.selectors';
import { selectAllTags } from '../../features/tag/store/tag.reducer';
import { TaskService } from '../../features/tasks/task.service';
import { DEFAULT_TASK } from '../../features/tasks/task.model';
import { DEFAULT_TAG } from '../../features/tag/tag.const';

// Use real model defaults; selectors already exclude archived Projects.
describe('GtdDashboardComponent', () => {
  const done = jasmine.createSpy('setDone');
  beforeEach(async () => {
    done.calls.reset();
    await TestBed.configureTestingModule({
      imports: [GtdDashboardComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: TaskService, useValue: { setDone: done } },
        provideMockStore({ selectors: [
          { selector: selectUnarchivedProjects, value: [] },
          { selector: selectAllTags, value: [
            { ...DEFAULT_TAG, id: 'na', title: 'NA' },
            { ...DEFAULT_TAG, id: 'home', title: 'c-home' },
            { ...DEFAULT_TAG, id: 'other', title: 'Other' },
          ] },
          { selector: selectAllTasksInActiveProjects, value: [
            { ...DEFAULT_TASK, id: 'next', title: 'Call supplier', tagIds: ['na'] },
            { ...DEFAULT_TASK, id: 'done', tagIds: ['na'], isDone: true },
            { ...DEFAULT_TASK, id: 'ordinary', tagIds: [] },
          ] },
        ] }),
      ],
    }).compileComponents();
  });

  it('shows only unfinished NA tasks and c- Contexts', () => {
    const fixture = TestBed.createComponent(GtdDashboardComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.nextActions().map((task) => task.id)).toEqual(['next']);
    expect(fixture.componentInstance.contexts().map((tag) => tag.id)).toEqual(['home']);
    expect(fixture.nativeElement.querySelectorAll('.action-row').length).toBe(1);
  });

  it('completes through the native TaskService when the checkbox is clicked', () => {
    const fixture = TestBed.createComponent(GtdDashboardComponent);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.action-row input').click();
    expect(done).toHaveBeenCalledOnceWith('next');
  });
});
