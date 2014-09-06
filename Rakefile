SVGJS_VERSION = '1.0.1'

# all available modules in the correct loading order
MODULES = %w[ svg selector inventor polyfill regex default color array pointarray patharray number viewbox bbox rbox element parent container fx relative event defs group arrange mask clip gradient pattern doc shape symbol use rect ellipse line poly path image text textpath nested hyperlink marker sugar set data memory loader helpers ]

# how many bytes in a "kilobyte"
KILO = 1024

# define default task
task :default => :dist

# module-aware file task
class BuildTask < Rake::FileTask
  
  def modules
    prerequisites.map { |f| File.basename(f, '.js') }
  end

  def remove_prerequisites to_remove
    @prerequisites -= to_remove
    return self
  end

  def needed?() super or modules_mismatch? end

  def modules_mismatch?
    previous_modules != modules
  end

  def previous_modules
    first_line =~ / - ([\w,\s]+) - / && $1.split(/\W+/)
  end

  def first_line
    File.open(name, 'r') { |f| f.gets }
  end
  
end

BuildTask.define_task 'dist/svg.js' => MODULES.map {|m| "src/#{ m }.js" } do |task|
  mkdir_p 'dist', :verbose => false
  
  svgjs = ''
  
  task.prerequisites.each do |src|
    # bring in source files one by one, but without copyright info
    copyright = true
    File.open(src).each_line do |line|
      copyright = false if copyright and line !~ %r{^(/|\s*$)}
      svgjs << "  #{ line }" unless copyright
    end
    svgjs << "\n\n"
  end
  
  File.open(task.name, 'w') do |file|
    file.puts "/* svg.js %s - %s - svgjs.com/license */" % [version_string, task.modules.join(' ')]
    file.puts ";(function(root, factory) {"
    file.puts "  if (typeof define === 'function' && define.amd) {"
    file.puts "    define(factory);"
    file.puts "  } else if (typeof exports === 'object') {"
    file.puts "    module.exports = factory();"
    file.puts "  } else {"
    file.puts "    root.SVG = factory();"
    file.puts "  }"
    file.puts "}(this, function() {"
    file.puts "\n"
    file.puts svgjs
    file.puts "  return SVG"
    file.puts "}));"
  end
  
end

file 'dist/svg.min.js' => 'dist/svg.js' do |task|
  require 'rubygems'
  begin require 'uglifier'
  rescue LoadError; fail "Uglifier not available: #{$!}"
  else
    File.open(task.name, 'w') do |min|
      min << Uglifier.new.compile(File.read(task.prerequisites.first))
    end
  end
end

file 'dist/svg.min.gz' => 'dist/svg.min.js' do |task|
  verbose false do
    tmp_file = task.name.sub('.gz', '')
    cp task.prerequisites.first, tmp_file
    sh 'gzip', '--best', tmp_file
  end
end

desc "Concatenate source files to build svg.js"
task :concat, [:modules] do |task, args|
  modules = args[:modules].to_s.split(':')
  toattrsdd, to_exclude = modules.partition {|m| m.sub!(/^(-)?(.+)/, 'src/\2.js'); !$1 }

  Rake::Task['dist/svg.js'].
    remove_prerequisites(to_exclude).enhance(toattrsdd).
    invoke
end

desc "Generate svg.js distribution files and report size statistics"
task :dist => ['dist/svg.js', 'dist/svg.min.js', 'dist/svg.min.gz'] do |task|
  orig_size, min_size, gz_size = task.prerequisites.map {|f| File.size(f) }

  puts "Original version: %.3fk" % (orig_size.to_f / KILO)
  puts "Minified: %.3fk" % (min_size.to_f / KILO)
  puts "Minified and gzipped: %.3fk, compression factor %.3f" % [gz_size.to_f / KILO, orig_size.to_f / gz_size]

  rm_f 'dist/svg.min.gz', :verbose => false
end

desc "List available modules"
task :modules do
  Dir['src/**/*.js'].each do |file|
    name = file.gsub(/^src\//,'').gsub(/.js$/,'')
    puts name + (MODULES.include?(name) ? '*' : '')
  end
  puts "\n*included in default build"
end

task(:clean) { rm_rf 'dist' }

desc "Run tests with PhantomJS"
task :test do
  sh 'script/test'
  Rake::Task[:check_whitespace].invoke
end

desc "Strip trailing whitespace and ensure each file ends with a newline"
task :whitespace do
  verbose false do
    files = Dir['{src,test,examples}/**/*.{js,html}']
    ruby(*%w'-p -i -e $_.sub!(/\s*\Z/,"\n")'.concat(files))
  end
end

desc "Checks for trailing whitespace in source files and tests"
task :check_whitespace do
  flunked = false
  flunk = lambda {|file, num| flunked = true; puts "#{file}:#{num}" }
  Dir['{src,test,examples}/**/*.{js,html}'].each do |file|
    File.open(file, 'r') {|f| f.each_with_index {|ln, num| flunk.call(file, num + 1) if ln.chomp =~ /\s+$/ } }
  end
  fail if flunked
end

# svg.js version number + git sha if available
def version_string
  desc = `git describe --tags HEAD 2>&1`.chomp
  if $?.success?
    desc
  else
    suffix, dir = '', File.basename(Dir.pwd)
    # detect git sha from directory name of GitHub zip/tarball
    suffix = "-g#{$1}" if dir =~ /^wout-svg.js-([a-f0-9]{7,40})$/
    SVGJS_VERSION + suffix
  end
end