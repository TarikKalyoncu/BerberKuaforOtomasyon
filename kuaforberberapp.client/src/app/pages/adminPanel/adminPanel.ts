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
    { label: 'Hizmet İşlemleri', action: 'product-management', icon: 'shopping_bag' },
    { label: 'Tüm Randevular', action: 'orders', icon: 'event' },
    { label: 'Randevu Düzenle', action: 'reports', icon: 'edit_calendar' },
    { label: 'Ayarlar', action: 'settings', icon: 'settings' },
    { label: 'Çıkış', action: 'logout', icon: 'logout' },
  ];



  onButtonClick(action: string): void {
    this.router.navigate([`admin/panel/${action}`]);
    // Burada butonun işlevselliğini yönlendirebilirsiniz.
  }




}