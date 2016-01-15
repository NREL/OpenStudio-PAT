export class BCL {
  constructor($q, $http, $uibModal) {
    'ngInject';

    this.service = {};
    this.$http = $http;
    this.$uibModal = $uibModal;
    this.$q = $q;

  }

  // DOWNLOAD COMPONENT BY UID
  download(the_uids) {
    return this.$http.get('http://bcl7.development.nrel.gov/api/component/download/', {
      params: {uids: the_uids},
      responseType: 'arraybuffer'
    });
  }

  // GET ALL MEASURE CATEGORIES
  // TODO: SHOULD PROBABLY MOVE THAT TO MAIN ROUTING WITH PROMISES (LIKE CONSTRUCTIONS IN CBECC-COM)
  getCategories() {
    return this.$http.get('http://bcl7.development.nrel.gov/api/taxonomy/measure.json');
  }

  // TODO: SEARCH BCL ONLINE

  // TODO: SEARCH LOCAL? (how to search?)

  // OPEN BCL LIBRARY MODAL
  openBCLModal() {
    let deferred = this.$q.defer();

    let modalInstance = this.$uibModal.open({
      backdrop: 'static',
      controller: 'ModalBCLCtrl',
      templateUrl: '/bcl/bcl.html',
      windowClass: 'wide-modal'

    });

    modalInstance.result.then(function () {
      deferred.resolve();
    }, function () {
      // Modal canceled
      deferred.reject();
    });
    return deferred.promise;
  }

}
