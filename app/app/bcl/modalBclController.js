export class ModalBclController {

  constructor($log, $uibModalInstance, _, BCL) {

    'ngInject';

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

      if (response.data['term'] != undefined) {
        this.categories = [];
        // 3 possible levels of nesting
        this._.each(response.data['term'], function (term) {
          let cat1 = {};
          cat1.name = term['name'];
          cat1.tid = term['tid'];
          let cat1_terms = [];
          this._.each(term['term'], function (term2) {
            let cat2 = {};
            cat2.name = term2['name'];
            cat2.tid = term2['tid'];
            let cat2_terms = [];
            this._.each(term2['term'], function (term3) {
              let cat3 = {};
              cat3.name = term3['name'];
              cat3.tid = term3['tid'];
              cat2_terms.push(cat3);
            });
            cat2.children = cat2_terms;
            cat1_terms.push(cat2);
          });
          cat1.children = cat1_terms;
          this.categories.push(cat1);
        });

        this.$log.debug('Categories: ', this.categories);
        //this.categories = categories;

      }
    });
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
