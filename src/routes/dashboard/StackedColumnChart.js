import React from 'react';
import PropTypes from 'prop-types';
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from 'bizcharts';
import moment from 'moment';
import DataSet from '@antv/data-set';

const propTypes = {
  chartData: PropTypes.array
};

class StackedColumnChart extends React.Component {
  static defaultProps = {
    chartData: []
  };

  getFormateDate(date) {
    return moment(date).format('YYYYMMDD');
  }
  getFields() {
    const { chartData } = this.props;
    return chartData.map(data => {
      return this.getFormateDate(data.range.date);
    });
  }

  getOriginData() {
    const { chartData } = this.props;
    const projectContainer = {};
    chartData.forEach(element => {
      const currentDate = this.getFormateDate(element.range.date);
      element.projects.forEach(project => {
        const hours = project.total_seconds / 3600;
        // 如果项目名称已经存在的话，则直接把值追加到该对象
        if (projectContainer[project.name]) {
          projectContainer[project.name][currentDate] = hours;
        } else {
          // 不存在的话，则新家
          projectContainer[project.name] = {
            name: project.name,
            [currentDate]: project.total_seconds / 3600
          };
        }
      });
    });
    return Object.keys(projectContainer).map(name => {
      return projectContainer[name];
    });
  }

  render() {
    const ds = new DataSet();
    const dv = ds.createView().source(this.getOriginData());

    dv.transform({
      type: 'fold',
      fields: this.getFields(),
      // 展开字段集
      key: 'key',
      // key字段
      value: 'value' // value字段
    });
    return (
      <div>
        <Chart height={400} data={dv} forceFit>
          <Legend />
          <Axis name="key" />
          <Axis name="value" />
          <Tooltip />
          <Geom
            type="intervalStack"
            position="key*value"
            color={'name'}
            style={{
              stroke: '#fff',
              lineWidth: 1
            }}
          />
        </Chart>
      </div>
    );
  }
}

StackedColumnChart.propTypes = propTypes;
export default StackedColumnChart;
