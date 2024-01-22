const gulp = require('gulp')
const babel = require('gulp-babel')
const scss = require('gulp-scss')
const fs = require('fs-extra')
const path = require('path')
const getScssConfig = require('./scssConfig')
const scssConfig = getScssConfig()
const antPrefixScssConfig = getScssConfig({ isAntPrefix: true })

// 是否编译 commonjs
const isCommonJS = process.argv[3] === '--cjs'
const folderName = isCommonJS ? 'lib' : 'esm'

const paths = {
  buildStyles: `${folderName}/styles`,
  js: 'src/**/!(*.test).+(tsx|js|ts)',
  scss: 'src/**/!(*.module).scss',
  fullScss: `${folderName}/styles/index.scss`,
  types: 'types/**/!(*.test).+(tsx|js|ts)',
  // changelog: 'CHANGELOG.md',
  changelogDest: 'docs/',
  assets: 'src/assets/**/*',
  assetsDest: `${folderName}/assets`
}

/**
 * 创建待编译的 scss 文件
 * 1. 包含 core + 所有组件样式的完整 scss
 * 2. 只包含所有组件样式的 scss
 * 3. 只包含自己编写的组件 scss
 */
const createScssFile = cb => {
  const cwd = process.cwd()
  const componentsPath = path.resolve(cwd, 'src')
  let fullScss = ''
  let compatComponentScss = ''

  fs.ensureDirSync(paths.buildStyles)

  fs.readdir(componentsPath, (err, files) => {
    files.forEach(file => {
      if (fs.existsSync(path.resolve(folderName, file, 'style.scss'))) {
        fullScss += `@import "../${file}/style.scss";\n`
      }

      if (fs.existsSync(path.resolve(folderName, file, 'override.scss'))) {
        compatComponentScss += `@import "../${file}/override.scss";\n`
      }
    })
    // 不用modifyVars的方式，直接引入样式变量文件覆盖主题，这样可以给外面用，外面可以再覆盖一层
    // fullscss += `@import "../styles/theme.scss";\n`
    // compatComponentscss += `@import "../styles/theme.scss";\n`
    fs.writeFileSync(path.resolve(cwd, paths.fullScss), fullScss)

    cb()
  })
}

gulp.task('js', () => {
  const params = isCommonJS
    ? {
        overrides: [
          {
            // plugins: ['@babel/plugin-transform-modules-commonjs']
          }
        ]
      }
    : {}

  return pipeToDest(
    gulp.src(paths.js).pipe(babel({ envName: 'production', ...params }))
  )
})

const pipeToDest = instance => instance.pipe(gulp.dest(folderName))

// gulp.task('fullScss', () => {
//   return gulp
//     .src(paths.fullScss, { allowEmpty: false })
//     .pipe(scss(scssConfig))
//     .pipe(gulp.dest(paths.buildStyles))
// })

gulp.task('handleTs', () => {
  return pipeToDest(gulp.src(paths.types))
})

// gulp.task('copyChangelog', () => {
//   return gulp.src(paths.changelog).pipe(gulp.dest(paths.changelogDest))
// })

gulp.task('copyScss', () => {
  return pipeToDest(gulp.src(paths.scss))
})

gulp.task('copyAssets', () => {
  return gulp.src(paths.assets).pipe(gulp.dest(paths.assetsDest))
})

module.exports = {
  build: gulp.series(
    'copyScss',
    createScssFile,
    gulp.parallel('js', 'handleTs', 'copyAssets')
  )
}
