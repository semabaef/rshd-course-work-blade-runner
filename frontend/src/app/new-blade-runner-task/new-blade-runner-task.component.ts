import {Component, OnInit} from '@angular/core';
import {Humanoid} from '../samples/humanoid';
import {BladeRunner} from '../samples/blade-runner';
import {MessageService} from 'primeng/api';
import {DialogService} from 'primeng/dynamicdialog';
import {SelectReplicantPopupComponent} from '../popups/select-replicant-popup/select-replicant-popup.component';
import {SelectBladeRunnerPopupComponent} from '../popups/select-blade-runner-popup/select-blade-runner-popup.component';
import {BladeRunnersService} from "../services/blade-runners.service";

@Component({
  selector: 'app-new-blade-runner-task',
  templateUrl: './new-blade-runner-task.component.html',
  styleUrls: ['./new-blade-runner-task.component.css'],
  providers: [DialogService]
})
export class NewBladeRunnerTaskComponent implements OnInit {

  replicant: Humanoid;
  replicantName: string;
  bladeRunner: BladeRunner;
  bladeRunnerName: string;


  constructor(public messageService: MessageService,
              public dialogService: DialogService,
              public bladeRunnerService: BladeRunnersService) {
  }

  ngOnInit(): void {
  }

  selectReplicant() {
    const ref = this.dialogService.open(SelectReplicantPopupComponent, {
      header: 'Выберите репликанта',
      width: '80%'
    });
    ref.onClose.subscribe((replicant: Humanoid) => {
      if (replicant) {
        this.replicant = replicant;
        this.replicantName = '[' + replicant.entityId + '] ' + replicant.fullName;
      }
    });
  }

  selectBladeRunner() {
    const ref = this.dialogService.open(SelectBladeRunnerPopupComponent, {
      header: 'Выберите Бегущего по лезвию',
      width: '80%'
    });
    ref.onClose.subscribe((bladeRunner: BladeRunner) => {
      if (bladeRunner) {
        this.bladeRunner = bladeRunner;
        this.bladeRunnerName = '[' + bladeRunner.br_id + '] ' + bladeRunner.entity.fullName;
      }
    });
  }

  confirm() {
    if (this.replicantName == undefined || this.bladeRunnerName == undefined) {
      this.onError('Вы не выбрали репликанта или бегущего по лезвию');
    } else {
      this.bladeRunnerService.setBladeRunnerTask(this.bladeRunner, this.replicant).subscribe({
        next: result=> {this.onSuccess("Задание создано!")},
        error: error=>{this.onError(error.message)}
      })
      this.bladeRunnerName = undefined;
      this.replicantName = undefined;
    }
  }

  onSuccess(message: any) {
    this.messageService.add({severity: 'success', summary: 'Success', detail: message, life: 2000});
  }

  onError(message: any) {
    this.messageService.add({severity: 'error', summary: 'Error!', detail: message, life: 2000});
  }
}
