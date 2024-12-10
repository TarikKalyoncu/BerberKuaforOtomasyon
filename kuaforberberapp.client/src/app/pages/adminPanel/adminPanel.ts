import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-adminPanel',
  templateUrl: './adminPanel.html',
  standalone: false,
  styleUrls: ['./adminPanel.css'],
})
export class AdminPanelComponent implements OnInit {

  constructor(private router: Router) { }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  buttons = [
    { label: 'Çalışan İşlemleri', action: 'employee-management', icon: 'group' },
    { label: 'Hizmet İşlemleri', action: 'service-management', icon: 'shopping_bag' },
    { label: 'Tüm Hizmetler', action: 'employee-services', icon: 'event' },
    { label: 'Randevu İşlemleri', action: 'appointment-management', icon: 'edit_calendar' },
    { label: 'Ayarlar', action: 'settings', icon: 'settings' },
    { label: 'Çıkış', action: '', icon: 'logout' },
  ];



  onButtonClick(action: string): void {
    if (action === '') {
      this.router.navigate(['/']); // Navigate to home page (http://localhost:4200/)
    } else {
      // Handle other actions (navigation to other components/pages)
      this.router.navigate([`admin/panel/${action}`]);
    }
  }



}
