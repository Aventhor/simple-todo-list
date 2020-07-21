import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { ITodoItem } from "./todo-item";

interface Props {
    show: boolean;
    tasks: ITodoItem[];
    maxNestedCount: number;
    onClose: () => void;
    onSave: (task: ITodoItem) => void;
}

export default function NewTaskDialog(props: Props) {
    const initialTask = {
        id: Math.floor(Math.random() * 100), // random id generator
        parentElementId: 0,
        isCompleted: false,
        name: "",
        subTasks: [],
    } as ITodoItem;

    const [task, setTask] = useState<ITodoItem>(initialTask);
    const [validated, setValidated] = useState(false);

    const handleChangeInput = (e: any) => {
        const { name, value } = e.target;

        setTask((prevState) => ({
            ...prevState,
            [name]: name === "parentElementId" ? +value : value,
        }));
    };

    const handleAddTask = (e: any) => {
        const form = e.currentTarget;
        if (!form.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
        }

        setValidated(true);

        if (!task.name.length) return;

        props.onSave(task);
        handleClose();
    };

    const handleClose = () => {
        setTask(initialTask);
        setValidated(false);
        props.onClose();
    };

    const getSelectOptions = (
        tasks: ITodoItem[],
        nestedCount?: number
    ): ITodoItem[] => {
        if (
            nestedCount !== undefined &&
            nestedCount >= props.maxNestedCount - 1
        )
            return [] as ITodoItem[];

        const newTasks = tasks
            .map((el) => {
                if (!el.subTasks.length) return [el];
                const subOpt = getSelectOptions(
                    el.subTasks,
                    nestedCount !== undefined ? nestedCount + 1 : 0
                );
                return [el, ...subOpt];
            })
            .flat(1);

        return newTasks;
    };

    return (
        <Modal show={props.show} size="lg" centered onHide={props.onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Добавление новой задачи</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form validated={validated}>
                    <Form.Group>
                        <Form.Label>Родительский элемент</Form.Label>
                        <Form.Control
                            as="select"
                            custom
                            name="parentElementId"
                            onChange={handleChangeInput}
                        >
                            <option value={0}>Корень</option>
                            {getSelectOptions(props.tasks).map((task) => {
                                return (
                                    <option key={task.id} value={task.id}>
                                        {task.name}
                                    </option>
                                );
                            })}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Название</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            required
                            onChange={handleChangeInput}
                        />
                        <Form.Control.Feedback type="invalid">
                            Это обязательное поле
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleClose}>Отмена</Button>
                <Button onClick={handleAddTask}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
}
