import {mount} from 'enzyme';
import React from 'react';

import {initializeOrg} from 'app-test/helpers/initializeOrg';
import IncidentRulesList from 'app/views/settings/projectIncidentRules/list';

describe('Incident Rules List', function() {
  it('renders', function() {
    const {organization, project, routerContext} = initializeOrg();
    const rule = TestStubs.IncidentRule();
    const req = MockApiClient.addMockResponse({
      url: `/projects/${organization.slug}/${project.slug}/alert-rules/`,
      body: [rule],
    });
    const wrapper = mount(
      <IncidentRulesList
        params={{orgId: organization.slug, projectId: project.slug}}
        organization={organization}
      />,
      routerContext
    );

    expect(req).toHaveBeenCalled();
    expect(wrapper.find('RuleLink').text()).toEqual('My Incident Rule');
  });
});
