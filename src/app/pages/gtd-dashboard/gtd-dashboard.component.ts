import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { RouterLink } from '@angular/router';
import { MatAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCheckbox } from '@angular/material/checkbox';
import { TranslatePipe } from '@ngx-translate/core';
import { selectAllTasksInActiveProjects } from '../../features/tasks/store/task.selectors';
import { selectUnarchivedProjects } from '../../features/project/store/project.selectors';
import { selectAllTags } from '../../features/tag/store/tag.reducer';
import { TaskService } from '../../features/tasks/task.service';
import { T } from '../../t.const';

@Component({
  selector: 'gtd-dashboard',
  standalone: true,
  imports: [RouterLink, MatAnchor, MatIcon, MatCheckbox, TranslatePipe],
  templateUrl: './gtd-dashboard.component.html',
  styleUrl: './gtd-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GtdDashboardComponent {
  private readonly _store = inject(Store);
  private readonly _taskService = inject(TaskService);
  private readonly _tasks = this._store.selectSignal(selectAllTasksInActiveProjects);
  private readonly _tags = this._store.selectSignal(selectAllTags);
  readonly T = T;
  readonly projects = this._store.selectSignal(selectUnarchivedProjects);
  readonly contexts = computed(() =>
    this._tags().filter((tag) => tag.title.startsWith('c-')),
  );
  readonly nextActions = computed(() => {
    const nextActionIds = new Set(
      this._tags()
        .filter((tag) => tag.title === 'NA')
        .map((tag) => tag.id),
    );
    return this._tasks().filter(
      (task) => !task.isDone && task.tagIds.some((id) => nextActionIds.has(id)),
    );
  });

  completeTask(id: string): void {
    this._taskService.setDone(id);
  }
}
