import React from 'react';
import PropTypes from 'prop-types';
import { groupBy, mapValues, take, get } from 'lodash';

import {
  KuiModal,
  KuiModalHeader,
  KuiModalHeaderTitle,
  KuiModalBody,
  KuiModalBodyText,
  KuiModalFooter,
  KuiButton,
  KuiModalOverlay,
  KuiTable,
  KuiTableBody,
  KuiTableHeader,
  KuiTableHeaderCell,
  KuiTableRow,
  KuiTableRowCell,
  KuiControlledTable,
  KuiToolBar,
  KuiToolBarSection,
  KuiPager,
} from 'ui_framework/components';

import { ESC_KEY_CODE } from 'ui_framework/services';

export class ChangeIndexModal extends React.Component {
  constructor(props) {
    super(props);

    const byId = groupBy(props.conflictedObjects, ({ obj }) => obj.searchSource.getOwn('index'));
    this.state = {
      page: 0,
      perPage: 10,
      objects: mapValues(byId, (list, indexPatternId) => {
        return {
          newIndexPatternId: get(props, 'indices[0].id'),
          list: list.map(({ doc }) => {
            return {
              id: indexPatternId,
              type: doc._type,
              name: doc._source.title,
            };
          })
        };
      })
    };
  }

  changeIndex = () => {
    const result = Object.keys(this.state.objects).map(indexPatternId => ({
      oldId: indexPatternId,
      newId: this.state.objects[indexPatternId].newIndexPatternId,
    }));
    this.props.onChange(result);
  };

  onIndexChange = (id, event) => {
    event.persist();
    this.setState(state => {
      return {
        objects: {
          ...state.objects,
          [id]: {
            ...state.objects[id],
            newIndexPatternId: event.target.value,
          }
        }
      };
    });
  };

  onKeyDown = (event) => {
    if (event.keyCode === ESC_KEY_CODE) {
      this.props.onClose();
    }
  };

  render() {
    const { page, perPage } = this.state;
    const totalIndexPatterns = Object.keys(this.state.objects).length;
    const indexPatternIds = Object.keys(this.state.objects).slice(page, page + perPage);
    const rows = indexPatternIds.map((indexPatternId, key) => {
      const objects = this.state.objects[indexPatternId].list;
      const sample = take(objects, 5).map((obj, key) => <span key={key}>{obj.name}<br/></span>);

      return (
        <KuiTableRow key={key}>
          <KuiTableRowCell>
            {indexPatternId}
          </KuiTableRowCell>
          <KuiTableRowCell>
            {objects.length}
          </KuiTableRowCell>
          <KuiTableRowCell>
            {sample}
          </KuiTableRowCell>
          <KuiTableRowCell>
            <select
              className="kuiSelect kuiSelect--medium"
              data-test-subj="managementChangeIndexSelection"
              value={this.state.objects[indexPatternId].newIndexPatternId}
              onChange={this.onIndexChange.bind(this, indexPatternId)}
            >
              <option value={indexPatternId}>Skip import</option>
              {this.props.indices.map((index, i) => {
                return (
                  <option key={i} value={index.id}>
                    {index.get('title')}
                  </option>
                );
              })}
            </select>
          </KuiTableRowCell>
        </KuiTableRow>
      );
    });

    const TableComponent = () => (
      <KuiTable className="kuiVerticalRhythm">
        <KuiTableHeader>
          <KuiTableHeaderCell style={{ maxWidth: '300px', width: '300px' }}>
            ID
          </KuiTableHeaderCell>
          <KuiTableHeaderCell style={{ maxWidth: '50px', width: '50px' }}>
            Count
          </KuiTableHeaderCell>
          <KuiTableHeaderCell>
            Sample of affected objects
          </KuiTableHeaderCell>
          <KuiTableHeaderCell style={{ maxWidth: '200px', width: '200px' }}>
            New index pattern
          </KuiTableHeaderCell>
        </KuiTableHeader>
        <KuiTableBody>
          {rows}
        </KuiTableBody>
      </KuiTable>
    );

    return (
      <KuiModalOverlay>
        <KuiModal
          data-tests-subj="managementChangeIndexModal"
          aria-label="Index does not exist"
          className="managementChangeIndexModal"
          onKeyDown={this.onKeyDown}
        >
          <KuiModalHeader>
            <KuiModalHeaderTitle>
              Index Pattern Conflicts
            </KuiModalHeaderTitle>
          </KuiModalHeader>
          <KuiModalBody>
            <KuiModalBodyText>
              <p>
                The following saved objects use index patterns that do not exist.
                Please select the index patterns you&apos;d like re-associated them with.
              </p>
            </KuiModalBodyText>
            { totalIndexPatterns > perPage
              ?
                <KuiControlledTable>
                  <KuiToolBar>
                    <KuiToolBarSection>
                      <KuiPager
                        startNumber={page + 1}
                        hasPreviousPage={page >= 1}
                        hasNextPage={page < totalIndexPatterns}
                        endNumber={Math.min(totalIndexPatterns, page + perPage)}
                        totalItems={totalIndexPatterns}
                        onNextPage={() => this.setState({ page: page + 1 })}
                        onPreviousPage={() => this.setState({ page: page - 1 })}
                      />
                    </KuiToolBarSection>
                  </KuiToolBar>
                  <TableComponent/>
                </KuiControlledTable>
              :
                <TableComponent/>
            }
          </KuiModalBody>

          <KuiModalFooter>
            <KuiButton
              buttonType="hollow"
              data-test-subj="changeIndexCancelButton"
              onClick={this.props.onClose}
            >
              Cancel
            </KuiButton>
            <KuiButton
              buttonType="primary"
              data-test-subj="changeIndexConfirmButton"
              onClick={this.changeIndex}
            >
              Confirm all changes
            </KuiButton>
          </KuiModalFooter>
        </KuiModal>
      </KuiModalOverlay>
    );
  }
}

ChangeIndexModal.propTypes = {
  onChange: PropTypes.func,
  onClose: PropTypes.func,
  conflictedObjects: PropTypes.arrayOf(PropTypes.shape({
    obj: PropTypes.object.isRequired,
    doc: PropTypes.object.isRequired,
  })).isRequired,
  indices: PropTypes.array
};
