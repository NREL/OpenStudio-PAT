export class BCL {
  constructor($q, $http, $uibModal, $log) {
    'ngInject';

    const vm = this;
    vm.service = {};
    vm.$http = $http;
    vm.$uibModal = $uibModal;
    vm.$q = $q;
    vm.$log = $log;
    vm.bcl_measures = [];
    vm.bcl_url = 'https://bcl.nrel.gov/api/';

  }

  // DOWNLOAD COMPONENT BY UID
  download(uids) {
    const vm = this;
    return vm.$http.get(vm.bcl_url + 'component/download/', {
      params: {uids: uids},
      responseType: 'arraybuffer'
    });
  }

  // GET ALL MEASURE CATEGORIES
  // TODO: SHOULD PROBABLY MOVE THAT TO MAIN ROUTING WITH PROMISES (LIKE CONSTRUCTIONS IN CBECC-COM)
  getCategories() {
    const vm = this;
    //return vm.$http.get('http://bcl7.development.nrel.gov/api/taxonomy/measure.json');
    return vm.$http.get(vm.bcl_url + 'taxonomy/measure.json');
  }

  // GET ALL MEASURES
  getMeasureMetadata() {
    const vm = this;
    const deferred = vm.$q.defer();
    vm.bcl_measures = [];
    const num_results = 100;
    const promises = [];
    const num_pages = 2; // TODO: use metadata URL to find out how many pages to retrieve
    const base_url = vm.bcl_url + 'search/?fq[]=bundle:nrel_measure&api_version=2&show_rows=' + num_results;
    let url = '';

    for (let page = 0; page < num_pages; page++) {
      url = base_url + '&page=' + page;
      const promise = vm.$http.get(url).then(function (response) {
        vm.$log.debug('RESPONSE: ', response);
        // TODO: parse response
        // flatten and transform response
        return  _.transform(_.flatten(response.data.result), function(result, i) {
          result.push(i.measure);
          return result;
        });

      }, function (error) {
        vm.$log.debug('ERROR:');
        vm.$log.debug(error);
      });
      promises.push(promise);
    }
     vm.$q.all(promises).then(function(measures_arrays) {
       vm.$log.debug('measures array: ', measures_arrays);
        _.each(measures_arrays, function(measures) {
          vm.bcl_measures = _.concat(vm.bcl_measures, measures);
        });
       deferred.resolve(vm.bcl_measures);

     }, function(response) {
       vm.$log.debug('ERROR retrieving BCL online measures!');
       deferred.reject(response);
     });
    return deferred.promise;

  }



  // FILTER MEASURES

  // TODO: SEARCH LOCAL? (how to search?)

  // OPEN BCL LIBRARY MODAL
  openBCLModal() {
    const vm = this;
    const modalInstance = vm.$uibModal.open({
      backdrop: 'static',
      controller: 'ModalBclController',
      controllerAs: 'modal',
      templateUrl: 'app/bcl/bcl.html',
      windowClass: 'wide-modal'
    });

    return modalInstance.result;
  }

}
