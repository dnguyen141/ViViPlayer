import React from 'react'
import Vivilayout from '../../layout/index';
import Video from '../../components/video/Video';
import { Row, Col } from 'antd';
import PropTypes from 'prop-types'
import ShotTable from '../../components/edit-video/ShotTable';

function index(props) {
    return (
        <Vivilayout>
            <Row className="row-responsive">
                <Col
                    className="col-responsive"
                    span={12}
                    style={{ padding: '25px', justifyContent: 'center' }}
                >
                    <Video />
                </Col>
                <Col
                    className="col-responsive"
                    span={12}
                    style={{ padding: '25px', justifyContent: 'center' }}
                >
                    <ShotTable />
                </Col>
            </Row>
        </Vivilayout>
    )
}

index.propTypes = {

}

export default index

