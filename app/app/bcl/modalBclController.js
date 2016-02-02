export class ModalBclController {

  constructor($log, $uibModalInstance, _, BCL) {
    'ngInject';

    const self = this;
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


    BCL.getCategories().then(response => {

      if (response.data.term) {
        const categories = [];
        // 3 possible levels of nesting
        _.each(response.data.term, term => {
          const cat1 = _.pick(term, ['name', 'tid']);
          const cat1_terms = [];
          _.each(term.term, term2 => {
            const cat2 = _.pick(term2, ['name', 'tid']);
            const cat2_terms = [];
            _.each(term2.term, term3 => {
              const cat3 = _.pick(term3, ['name', 'tid']);
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
