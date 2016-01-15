export class ModalBclController {

  constructor($modalInstance, BCL) {

    'ngInject';

    this.test = 'HELLO in Modal!';
    this.selected = null;
    this.keyword = '';
    this.categories = [];

    this.filters = {
      all: false,
      local: false,
      bcl: true,
      measure_dir: false
    };


    BCL.getCategories().then(function (response) {

      if (response.data['term'] != undefined) {
        categories = [];
        // 3 possible levels of nesting
        _.each(response.data['term'], function (term) {
          cat1 = {};
          cat1.name = term['name'];
          cat1.tid = term['tid'];
          cat1_terms = [];
          _.each(term['term'], function (term2) {
            cat2 = {};
            cat2.name = term2['name'];
            cat2.tid = term2['tid'];
            cat2_terms = [];
            _.each(term2['term'], function (term3) {
              cat3 = {};
              cat3.name = term3['name'];
              cat3.tid = term3['tid'];
              cat2_terms.push(cat3);
            });
            cat2.children = cat2_terms;
            cat1_terms.push(cat2);
          });
          cat1.children = cat1_terms;
          categories.push(cat1);
        });

        console.log('Categories: ', categories);
        this.categories = categories;

      }
    });
  }

  ok() {
    $modalInstance.close(this.selected);
  }

  cancel() {
    $modalInstance.dismiss('cancel');
  }


  search() {

    // first just search by keyword and display results

  }

}
