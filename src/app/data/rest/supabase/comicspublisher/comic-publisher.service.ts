import { Injectable } from '@angular/core';
// import { ClientService } from '../client.service';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class ComicPublisherService {
  supabase?: SupabaseClient;
  // constructor(private clientService: ClientService) {
    // this.supabase = clientService.supabase;
  // }

  constructor() {
  }
}
