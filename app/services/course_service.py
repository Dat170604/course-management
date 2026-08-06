from app.models.course import Course


def create_course(
    course,
    current_user,
    db
):

    new_course = Course(

        title=course.title,

        description=course.description,

        price=course.price,

        teacher_id=current_user.id

    )

    db.add(new_course)

    db.commit()

    db.refresh(new_course)

    return new_course