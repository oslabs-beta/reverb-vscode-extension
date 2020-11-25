const { src, dest } = require('gulp');

function copyHtml(cb) {
  src('react-app/dist/index.html').pipe(dest('out/'));
  cb();
}

exports.default = copyHtml;
