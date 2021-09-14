import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useContext, useState, useEffect } from 'react';
import { PostContext } from '../../contexts/PostContext';

const UpdatePostModal = () => {
    const {
        postState: { post },
        showUpdatePostModal,
        setShowUpdatePostModal,
        updatePost,
        setShowToast,
    } = useContext(PostContext);

    const [updatedPost, setUpdatedPost] = useState(post);

    useEffect(() => setUpdatedPost(post), [post]);

    const { title, description, url, status } = updatedPost;

    const onChangeUpdatedPostForm = (e) =>
        setUpdatedPost({ ...updatedPost, [e.target.name]: e.target.value });

    const resetPostData = () => {
        setUpdatedPost(post);
        setShowUpdatePostModal(false);
    };

    const onSubmitUpdatedPostForm = async (e) => {
        e.preventDefault();

        const { success, message } = await updatePost(updatedPost);

        resetPostData();

        setShowToast({
            show: true,
            message,
            type: success ? 'success' : 'danger',
        });
    };

    return (
        <Modal show={showUpdatePostModal} onHide={resetPostData}>
            <Modal.Header closeButton>
                <Modal.Title>Making progress?</Modal.Title>
            </Modal.Header>
            <Form onSubmit={onSubmitUpdatedPostForm}>
                <Modal.Body>
                    <Form.Group className='my-3'>
                        <Form.Control
                            type='text'
                            placeholder='Title'
                            name='title'
                            required
                            aria-describedby='title-help'
                            value={title}
                            onChange={onChangeUpdatedPostForm}
                        />
                        <Form.Text id='title-help' muted>
                            Required
                        </Form.Text>
                    </Form.Group>
                    <Form.Group className='my-3'>
                        <Form.Control
                            as='textarea'
                            rows={3}
                            placeholder='Description'
                            name='description'
                            value={description}
                            onChange={onChangeUpdatedPostForm}
                        />
                    </Form.Group>
                    <Form.Group className='my-3'>
                        <Form.Control
                            type='text'
                            placeholder='Url'
                            name='url'
                            value={url}
                            onChange={onChangeUpdatedPostForm}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control
                            as='select'
                            name='status'
                            value={status}
                            onChange={onChangeUpdatedPostForm}
                        >
                            <option value='TO LEARN'>TO LEARN</option>
                            <option value='LEARNING'>LEARNING</option>
                            <option value='LEARNED'>LEARNED</option>
                        </Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={resetPostData}>
                        Cancel
                    </Button>
                    <Button type='submit' variant='primary'>
                        LearnIt!
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default UpdatePostModal;
