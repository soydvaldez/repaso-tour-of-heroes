import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { MessageService } from '../../../messages/service/message.service';
import { Database } from './types/database.types';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  public supabase: SupabaseClient;

  constructor(private messageService: MessageService) {
    const apiKey = environment['apiKey'];
    const apiURL = environment['apiUrl'];  
    this.supabase = createClient<Database>(apiURL, apiKey);
  }
}
