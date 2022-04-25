import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { ServersService } from '../servers.service';

@Component({
  selector: 'app-edit-server',
  templateUrl: './edit-server.component.html',
  styleUrls: ['./edit-server.component.css']
})
export class EditServerComponent implements OnInit {
  server: { id: number, name: string, status: string };
  serverName = '';
  serverStatus = '';
  allowEdit = false;
  editSaved = false;

  constructor(private serversService: ServersService, private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(
      (queryParams: Params) => {
        this.allowEdit = queryParams['allowEdit'] === '1' ? true : false;
      }
    );
    this.route.fragment.subscribe();

    const id = +this.route.queryParams['id'];
    this.server = this.serversService.getServer(id);

    this.route.params.subscribe(
      (queryParams : Params) =>{
        this.server = this.serversService.getServer(+queryParams['id']);
      });

    this.serverName = this.server.name;
    this.serverStatus = this.server.status;
  }

  onUpdateServer() {
    this.serversService.updateServer(this.server.id, { name: this.serverName, status: this.serverStatus });
    this.editSaved = true;

    this.router.navigate(['../'], { relativeTo: this.route });
  }

  canDeactivate(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (!this.allowEdit) {
      return true;
    }

    //if text is different and changes not saved prompt user before exiting form
    if ((this.serverName !== this.server.name || this.serverStatus != this.server.status)
    && !this.editSaved){
      return confirm("Do you want to save these changes?")
    }else{
      return true;
    }
  }
}
