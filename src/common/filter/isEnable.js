export default function (value) {
    if (value == 0) {
        return "fa fa-times-circle danger";
    } else if (value == 1) {
        return "fa fa-check-circle success";
    }
}