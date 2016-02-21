export class BCL {
  constructor($q, $http, $uibModal) {
    'ngInject';

    this.service = {};
    this.$http = $http;
    this.$uibModal = $uibModal;
    this.$q = $q;

  }

  // DOWNLOAD COMPONENT BY UID
  download(uids) {
    return this.$http.get('http://bcl7.development.nrel.gov/api/component/download/', {
      params: {uids: uids},
      responseType: 'arraybuffer'
    });
  }

  // GET ALL MEASURE CATEGORIES
  // TODO: SHOULD PROBABLY MOVE THAT TO MAIN ROUTING WITH PROMISES (LIKE CONSTRUCTIONS IN CBECC-COM)
  getCategories() {
    //return this.$http.get('http://bcl7.development.nrel.gov/api/taxonomy/measure.json');
    return this.$http.get('https://bcl.nrel.gov/api/taxonomy/measure.json');
  }

  // TODO: SEARCH BCL ONLINE

  // TODO: SEARCH LOCAL? (how to search?)

  // OPEN BCL LIBRARY MODAL
  openBCLModal() {
    const modalInstance = this.$uibModal.open({
      backdrop: 'static',
      controller: 'ModalBclController',
      controllerAs: 'modal',
      templateUrl: 'app/bcl/bcl.html',
      windowClass: 'wide-modal'
    });

    return modalInstance.result;
  }

}
