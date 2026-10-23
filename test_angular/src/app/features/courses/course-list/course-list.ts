
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CourseService } from '../course.service';
import { Course } from '../course.model';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-list.html',
  styleUrl: './course-list.css',
})
export class CourseList implements OnInit {
  private courseService = inject(CourseService);

  courses = signal<Course[]>([]);
  loading = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.courseService.getCourses().subscribe({
      next: (data: unknown) => {
        console.log('Dữ liệu API courses:', data);

        let items: Course[] = [];

        if (Array.isArray(data)) {
          items = data as Course[];
        } else if (
          data !== null &&
          typeof data === 'object' &&
          'items' in data &&
          Array.isArray(data.items)
        ) {
          items = data.items as Course[];
        } else if (
          data !== null &&
          typeof data === 'object' &&
          'courses' in data &&
          Array.isArray(data.courses)
        ) {
          items = data.courses as Course[];
        } else {
          console.error('Cấu trúc dữ liệu courses không hợp lệ:', data);
          this.errorMessage.set(
            'Dữ liệu khóa học từ backend không đúng định dạng.'
          );
        }

        this.courses.set(items);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Lỗi lấy danh sách khóa học:', error);

        this.errorMessage.set(
          'Không thể tải danh sách khóa học. Vui lòng thử lại.'
        );

        this.loading.set(false);
      },
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price) + '$';
  }
}
