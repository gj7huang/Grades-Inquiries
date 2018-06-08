function readyFunc() {
    showCourseList();
    $('#search-stu').on('input', searchGrade);
}

function searchGrade() {
    let studentName = $('#search-stu').val();
    if (studentName) {
        $.ajax({
            url: '/searchGrade',
            type: 'GET',
            data: {
                couName: studentName
            }
        })
        .done(res => {
            // console.log(res);
            $('#grade-list').empty('');
            if (res.length === 0) {
                $('#grade-list').append(`<a id="no-found">No found</a>`)
            } else {
                filterItem(res)
                .sort(el => el.cou_id)
                .map(el => {
                    $('#grade-list').append(`
                        <div class="item">
                            <div class="cou-header">
                                <a>Course ID: ${el.cou_id}</a><br/>
                                <a>${el.cou_name}</a>
                            </div>
                            <div class="student-list">
                                ${el.stuList.map(el => {
                                    return `
                                    <div class="student">
                                        <a class="student-name">${el.stu_name}</a>
                                        <a>/ Grade: ${el.cou_grade} / ${getPassOrNot(el.cou_grade)}</a>
                                    </div>`
                                }).join('')}
                            </div>
                        <div>
                    `);
                })
            }
        })
    } else {
        $('#grade-list').html(`<a>Enter the value!</a>`);
    }
}

function getPassOrNot(grade) {
    return grade >= 60 ? '<a class="pass">Pass</a>' : '<a class="fail">Fail</a>';
}

function filterItem(res) {
    let list = new Set([])
    let newRes = res.reduce((acc, el) => {
        if (list.has(el.cou_id)) {
            acc.map(e => {
                if (e.cou_id === el.cou_id) {
                    e.stuList.push({
                        stu_id: el.stu_id,
                        stu_name: el.stu_name,
                        cou_grade: el.cou_grade
                    });
                }
            });
            return acc;
        } else {
            list.add(el.cou_id)
            acc.push({ 
                cou_id: el.cou_id,
                cou_name: el.cou_name,
                stuList: [
                    {
                        stu_id: el.stu_id,
                        stu_name: el.stu_name,
                        cou_grade: el.cou_grade
                    }
                ]
            });
            return acc;
        }
    }, [])
    return newRes
}

function showCourseList() {
    $.ajax({
        url: '/courseList',
        type: 'GET',
    })
    .done(res => {
        let unOrderList = $('<ul></ul>')
        res.map(el => {
            unOrderList.append(`
                <li>${el.cou_name}</li>
            `);
        })
        $('#course-list').append(unOrderList);
    })
}

$(document).ready(readyFunc);