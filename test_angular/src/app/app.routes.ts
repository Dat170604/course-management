
import { Routes } from '@angular/router';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Dashboard } from './features/dashboard/dashboard';
import { CourseList } from './features/courses/course-list/course-list';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  // =========================
  // AUTH
  // =========================
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: '',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [
      // =========================
      // DASHBOARD
      // =========================
      {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [authGuard],
      },

      // =========================
      // COURSES
      // =========================

      // Danh sách tất cả khóa học
      {
      path: 'courses',
      component: CourseList,
      canActivate: [authGuard],
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  // =========================
  // DEFAULT
  // =========================
  
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

