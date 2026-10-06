<?php

namespace App\Enums;

enum AuditAction: string
{
    case COMPLETE = 'COMPLETE';
    case ISSUE = 'ISSUE';
    case JUSTIFY = 'JUSTIFY';
    case SUBMIT = 'SUBMIT';
    case OBSERVE = 'OBSERVE';
    case CANCEL = 'CANCEL';
    case PAYMENT_VALIDATE = 'PAYMENT_VALIDATE';
    case ACTIVATE = 'ACTIVATE';
    case CLOSE = 'CLOSE';
    case DISABLE = 'DISABLE';
    case RELATE = 'RELATE';
    case UNRELATE = 'UNRELATE';
    case LOGIN = 'LOGIN';
    case LOGOUT = 'LOGOUT';
    case CREATE = 'CREATE';
    case UPDATE = 'UPDATE';
    case DELETE = 'DELETE';
    case APPROVE = 'APPROVE';
    case REJECT = 'REJECT';
    case PUBLISH = 'PUBLISH';
    case ARCHIVE = 'ARCHIVE';
    case REVIEW = 'REVIEW';
    case GRADE = 'GRADE';
    case SCORE_UPDATE = 'SCORE_UPDATE';
}
