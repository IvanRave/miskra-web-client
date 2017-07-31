var COMPONENT = 'appSplrFill';
describe('component: ' + COMPONENT, function() {
  var $componentController;

  beforeEach(module('myApp.' + COMPONENT));

  beforeEach(inject(function(_$componentController_) {
    $componentController = _$componentController_;
  }));

  it('should expose a `hero` object', function() {
    var bindings = { contacts: [
      { type: 'skype', value: true }
    ] };

    var ctrl = $componentController(COMPONENT, null, bindings);

    expect(ctrl.contacts).toBeDefined();
    expect(ctrl.contacts.length).toBe(1);
    expect(ctrl.percent).toBe(20);
  });
});
