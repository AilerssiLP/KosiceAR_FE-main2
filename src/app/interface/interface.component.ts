import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.css']
})
export class InterfaceComponent implements OnInit {
  email: string = '';
  token: string = '';
  expiration: string = '';
  password: string = '';
  userName: string = '';
  users: any[] = [];
  searchText: string = '';
  filteredUsers: any[] = [];
  sortStatusAsc: boolean = true;
  sortlockoutEnabledAsc: boolean = true;
  currentSortField: 'district' | 'lockoutEnabled' | null = null;
  currentPage: number = 1; // Current page number
  itemsPerPage: number = 2; // Number of items to display per page
  totalItems: number = 0; // Total number of items
  totalPages: number = 0;
  jumpToPage: number = 1;
  selectAll: boolean = false;

  displayedRange: string = '';


  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userName = params['userName'];
    });
    this.loadUsers();
  }
  toggleAll() {
    this.users.forEach(user => {
      user.selected = this.selectAll;
    });
  }
  
  // When individual checkboxes are clicked, update selectAll accordingly
  updateSelectAll() {
    this.selectAll = this.users.every(user => user.selected);
  }
  goToPage(page: number): void {
    const pageNumber = Number(page);
    if (pageNumber && pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      this.applyFilters();
      this.updateDisplayedRange();
    }
  }

  updateDisplayedRange(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage + 1;
    const endIndex = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    this.displayedRange = `${startIndex} - ${endIndex}`;
}

  trackByUserId(index: number, user: any): any {
    return user.id; // Assuming each user has a unique 'id' property
  }
  loadUsers(): void {
    this.authService.getUsers().subscribe(
        (data) => {
            this.users = data;
            this.filteredUsers = data;
            this.totalItems = this.users.length;
            this.currentPage = 1;
            this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
            this.applyFilters();
            this.updateDisplayedRange(); // Call the method here
        },
        (error) => {
            console.error('There was an error retrieving the users', error);
        }
    );
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyFilters();
      this.updateDisplayedRange(); // Make sure to call this here
    }
  }
  
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilters();
      this.updateDisplayedRange(); // And here
    }
  }
  

  // Inside InterfaceComponent class
  onItemsPerPageChange(): void {
    this.currentPage = 1; // Reset to the first page when items per page changes
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.applyFilters(); // Apply filters and sorting
  }

  resetPassword(): void {
    this.authService.resetPassword(this.email, this.token, this.expiration, this.password)
      .subscribe(response => {
        // Handle response
      }, error => {
        // Handle error
      });
  }

  toggleActive(user: any): void {
    user.lockoutEnabled = !user.lockoutEnabled;
    console.log('Updated User:', user);
    // Call the service to update the user's active state in the backend
    // this.authService.updateUserActiveState(user.id, user.lockoutEnabled).subscribe(...);
  }

  toggleSortStatus(): void {
    this.sortStatusAsc = !this.sortStatusAsc;
    this.currentSortField = 'district';
    this.applySort();
    
    // Manually trigger change detection to update the view
    this.changeDetectorRef.detectChanges();
  }
  

  toggleSortlockoutEnabled(): void {
    this.sortlockoutEnabledAsc = !this.sortlockoutEnabledAsc;
    this.currentSortField = 'lockoutEnabled';
    this.applySort();
    
    // Manually trigger change detection to update the view
    this.changeDetectorRef.detectChanges();
  }
  

  applySort(): void {
    let sortedUsers = [...this.filteredUsers]; // Create a deep copy
  
    sortedUsers.sort((a, b) => {
      // Convert district to numbers for proper sorting
      let districtA = parseFloat(a.district);
      let districtB = parseFloat(b.district);
  
      let statusA = a.status || '';
      let statusB = b.status || '';
      let lockoutEnabledA = (a.lockoutEnabled == null) ? '' : String(a.lockoutEnabled);
      let lockoutEnabledB = (b.lockoutEnabled == null) ? '' : String(b.lockoutEnabled);
  
      let comparison = 0;
  
      if (this.currentSortField === 'district') {
        comparison = this.sortStatusAsc ? statusA.localeCompare(statusB) : statusB.localeCompare(statusA);
        if (comparison === 0) {
          return this.sortlockoutEnabledAsc ? lockoutEnabledA.localeCompare(lockoutEnabledB) : lockoutEnabledB.localeCompare(lockoutEnabledA);
        }
      } if (this.currentSortField === 'lockoutEnabled') {
        comparison = this.sortlockoutEnabledAsc ? lockoutEnabledA.localeCompare(lockoutEnabledB) : lockoutEnabledB.localeCompare(lockoutEnabledA);
        if (comparison === 0) {
          // Compare by district (numeric)
          return this.sortStatusAsc ? districtA - districtB : districtB - districtA;
        }
      }
  
      return comparison;
    });
  
    this.filteredUsers = sortedUsers;
    this.changeDetectorRef.detectChanges(); // Trigger change detection
  }
  
  
  

  applyFilters(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
  
    // Filter by searchText first if it exists
    let tempUsers = this.searchText ? this.users.filter(user =>
      user.firstName.toLowerCase().includes(this.searchText.toLowerCase()) ||
      user.lastName.toLowerCase().includes(this.searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchText.toLowerCase()) ||
      user.lockoutEnabled.toLowerCase().includes(this.searchText.toLowerCase())
    ) : [...this.users];
    
    tempUsers = tempUsers.slice(startIndex, endIndex);

    this.filteredUsers = tempUsers;
    this.applySort(); 
  }

  search(): void {
    this.applyFilters();
  }
  
  // Add any additional methods or properties required for your component below
}
