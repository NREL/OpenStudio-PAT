export class ModalBclController {

  constructor($log, $uibModalInstance, _, BCL) {
    'ngInject';

    let self = this;
    this.test = 'HELLO in Modal!';
    this.selected = null;
    this.keyword = '';
    this.categories = [];

    this.$uibModalInstance = $uibModalInstance;
    this._ = _;
    this.$log = $log;

    this.filters = {
      all: false,
      local: false,
      bcl: true,
      measure_dir: false
    };


    BCL.getCategories().then(function (response) {

      if (response.data.term != undefined) {
        let categories = [];
        // 3 possible levels of nesting
        _.each(response.data.term, function (term) {
          let cat1 = _.pick(term, ['name', 'tid']);
          let cat1_terms = [];
          _.each(term.term, function (term2) {
            let cat2 = _.pick(term2, ['name', 'tid']);
            let cat2_terms = [];
            _.each(term2.term, function (term3) {
              let cat3 = _.pick(term3, ['name', 'tid']);
              cat2_terms.push(cat3);
            });
            cat2.children = cat2_terms;
            cat1_terms.push(cat2);
          });
          cat1.children = cat1_terms;
          categories.push(cat1);
        });

        self.$log.debug('Categories: ', categories);
        self.categories = categories;

      }
    });

    // for testing until electron works
    this.categories = [
      {name: 'A', tid: 1},
      {name: 'B', tid: 2},
      {name: 'C', tid: 3}
    ];

  }

  ok() {
    this.$uibModalInstance.close(this.selected);
  }

  cancel() {
    this.$uibModalInstance.dismiss('cancel');
  }

  search() {

    // first just search by keyword and display results

  }

}
