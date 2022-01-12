import React from 'react'
import Vivilayout from '../../layout/index';
import VideoEdit from '../../components/edit-video/VideoEdit';
import { Row, Col } from 'antd';
import PropTypes from 'prop-types'

function index(props) {
    return (
        <Vivilayout>
            <VideoEdit />
        </Vivilayout>
    )
}

index.propTypes = {

}

export default index

