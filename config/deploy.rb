set :scm, :git
set :repo_url, "git@git.i-deasoft.com:pliashkou/locksmith.git"
set :branch, "master"
set :deploy_via, :remote_cache
set :copy_strategy, :checkout
set :use_sudo, false
set :copy_compression, :bz2
set :normalize_asset_timestamps, false
set :user, 'ubuntu'
set :local_js, 'module.exports = { IS_BG_CHECK_ENABLED: false, IS_CUSTOMERS_LOCKING_ENABLED: false }'

namespace :deploy do
    def app_status
      within current_path do
        ps = JSON.parse(capture :pm2, :jlist, fetch(:app_command))
          if ps.empty?
            return nil
          else
            # status: online, errored, stopped
            return ps[0]["pm2_env"]["status"]
          end
      end
    end

    def start_app
      within current_path do
        user = fetch(:user)
        app = fetch(:application)
        env = fetch(:environment)

        execute "NODE_ENV=#{env} pm2 start #{current_path}/backend/app.js --user #{user} --name #{app}"
        execute "pm2 save"
      end
    end

    def stop_app
      within current_path do
        app = fetch(:application)

        execute "pm2 stop #{app}"
      end
    end

    def restart_app
      within current_path do
        app = fetch(:application)

        execute "pm2 restart #{app}"
      end
    end

    task :npm_install do
      on roles(:app) do
        execute "cd #{release_path} && npm install"
      end
    end

    task :bower_install do
      on roles(:app) do
        execute "cd #{release_path}/frontend && bower install"
      end
    end

    task :frontend_build do
      on roles(:app) do
        execute "cd #{release_path}/frontend && gulp build:production"
      end
    end

    task :backend_create_local_js do
      on roles(:app) do
        local_js = fetch(:local_js)

        execute "echo #{local_js} > #{release_path}/backend/config/local.js"
      end
    end

    task :restart do
      on roles(:app) do
        case app_status
          when nil
            info 'App is not registerd'
            start_app
          when 'stopped'
            info 'App is stopped'
            restart_app
          when 'errored'
            info 'App has errored'
            restart_app
          when 'online'
            info 'App is online'
            restart_app
        end
      end
    end

    after :updated, :cleanup
    after :updated, :backend_create_local_js
    after :updated, :npm_install
    after :updated, :bower_install
    after :updated, :frontend_build
    after :publishing, :restart
end