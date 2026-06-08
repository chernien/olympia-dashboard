import { Component, OnInit } from '@angular/core';
import { GuestService } from 'src/app/services/guest.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.css']
})
export class GuestComponent implements OnInit {
  guests: any[] = [];
  allGuests: any[] = [];
  filteredGuests: any[] = [];
  searchTerm: string = '';
  newGuest: any = {
    id: null,
    cliId: 0,
    num: '',
    cin: '',
    nom: '',
    prenom: '',
    tel: '',
    adresse: '',
    diva: '',
    fidelite: 0
  };
  userconnectcontact: any;
  currentPage: number = 0;
  itemsPerPage: number = 10;
  paginatedGuests: any[] = [];
  totalPages: number = 1;
  guestSelectionMode: 'new' | 'existing' = 'new'; 

  constructor(private guestService: GuestService, private snackBar: MatSnackBar) {
    this.userconnectcontact = JSON.parse(localStorage.getItem("Contact")!);
  }

  ngOnInit(): void {
    this.loadGuests();
    this.loadAllGuests();
  }

  loadGuests(): void {
    this.guestService.getGuests().subscribe(
      (data: any) => {
        const userCliId = Number(this.userconnectcontact?.t2_ID);
        this.guests = data.filter((guest: any) => Number(guest.cliId) === userCliId);
        this.filteredGuests = [...this.guests];
        this.updatePagination();
      },
      (error) => {
        console.error('Erreur lors du chargement des invités', error);
      }
    );
  }

  loadAllGuests(): void {
    this.guestService.getGuests().subscribe(
      (data: any) => {
        this.allGuests = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des invités', error);
      }
    );
  }

  filterGuests(): void {
    if (!this.searchTerm) {
      this.filteredGuests = [...this.guests];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredGuests = this.guests.filter(guest => 
        guest.nom.toLowerCase().includes(term) || 
        guest.prenom.toLowerCase().includes(term) ||
        guest.cin.toString().includes(term)
      );
    }
    this.updatePagination();
  }

  updatePagination(): void {
    this.currentPage = 0;
    this.calculatePages();
    this.updatePaginatedGuests();
  }

  calculatePages(): void {
    this.totalPages = Math.ceil(this.filteredGuests.length / this.itemsPerPage);
  }

  updatePaginatedGuests(): void {
    const start = this.currentPage * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedGuests = this.filteredGuests.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updatePaginatedGuests();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePaginatedGuests();
    }
  }

  toggleGuestSelection(mode: 'new' | 'existing'): void {
    this.guestSelectionMode = mode;
    this.resetGuestForm(); 
  }

loadExistingGuest(): void {
  const guest = this.allGuests.find(g => g.num === this.newGuest.num);
  if (guest) {
    this.newGuest = { ...guest };  
    this.newGuest.fidelite = 0;    
  } else {
    this.snackBar.open("Client introuvable", 'Fermer', { duration: 3000 });
  }
}


createGuest(): void {
    const contact = JSON.parse(localStorage.getItem("Contact") || "{}");

  Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: 'Voulez-vous vraiment ajouter ce client ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, ajouter!',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      if (this.guestSelectionMode === 'existing') {
        this.loadExistingGuest();
      } else {
        const existingGuest = this.allGuests.find(
          g => g.cin && this.newGuest.cin && 
               g.cin.toString() === this.newGuest.cin.toString()
        );
        if (!existingGuest) {
          const allNums = this.allGuests.map(g => parseInt(g.num, 10)).filter(n => !isNaN(n));
          const maxNum = allNums.length > 0 ? Math.max(...allNums) : 1000010;
          this.newGuest.num = (maxNum + 1).toString().padStart(8, '0');
        }
      }

      const guestToCreate = {
        ...this.newGuest,
        id: this.generateAbsoluteUniqueId(),
        cliId: this.userconnectcontact?.t2_ID || 0,
                // 🔥 envoyé seulement au backend
        dos: contact?.dos

        
      };

      this.guestService.createGuest(guestToCreate).subscribe({
        next: (response: any) => {
          this.allGuests.push(guestToCreate);
          this.guests.push(guestToCreate);
          this.filteredGuests.push(guestToCreate);
          this.updatePagination();
          this.resetGuestForm();
          this.snackBar.open('Invité créé avec succès!', 'Fermer', { duration: 3000 });
        },
        error: (error) => {
          if (error.status === 409) {
            // Message renvoyé par le backend dans le body
            const msg = error.error || 'Ce client existe déjà.';
            Swal.fire({
              title: 'Doublon détecté',
              text: msg,
              icon: 'error',
              confirmButtonText: 'OK'
            });
          } else {
            this.snackBar.open('Erreur lors de la création', 'Fermer', { duration: 3000 });
          }
        }
      });
    }
  });
}


  private generateAbsoluteUniqueId(): number {
    const maxId = this.allGuests.reduce((max, g) => g.id > max ? g.id : max, 0);
    return maxId + 1;
  }

  private resetGuestForm(): void {
    this.newGuest = { id: null, cliId: 0, num: '', cin: '', nom: '', prenom: '', tel: '', adresse: '', diva: '', fidelite: 0 };
  }

  deleteGuest(id: number): void {
    this.guestService.deleteGuest(id).subscribe(
      () => {
        this.guests = this.guests.filter(guest => guest.id !== id);
        this.snackBar.open('Invité supprimé avec succès!', 'Fermer', { duration: 3000 });
      },
      (error) => {
        this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
      }
    );
  }
}
