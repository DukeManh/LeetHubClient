import React from 'react'
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { Button } from 'semantic-ui-react';

export default function CommitForm({ formik, err, success }) {
    return (
        <div className="d-flex justify-content-end commit_form">
            <Col className="commit" xs={12} md={11} lg={10}>
                <h3>Commit changes</h3>
                <Form className="commit_form_data" autoComplete="off" onSubmit={formik.handleSubmit}>
                    <Form.Row>
                        <Form.Control placeholder="Commit message" type="text" name="message" value={formik.values.message} onChange={formik.handleChange} />
                    </Form.Row>
                    <Form.Row>
                        <Form.Control className="py-3" placeholder="Commit description" as="textarea" name="description" rows={6} value={formik.values.description} onChange={formik.handleChange} />
                    </Form.Row>
                    <Button type='submit' color="green">Commit</Button>
                </Form>
                <small className="text-success">{success}</small>
                <small className="text-danger">{err}</small>
            </Col>
        </div>
    )
}
