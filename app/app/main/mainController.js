export class MainController {

  constructor($log, BCL) {
    'ngInject';

    this.test = 'This is a test';
    this.BCL = BCL;
    this.$log = $log;

    this.$log.debug(this.BCL);

  }

}
