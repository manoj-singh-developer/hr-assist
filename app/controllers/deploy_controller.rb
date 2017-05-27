class DeployController < ApplicationController

    skip_before_action :verify_authenticity_token

    def index

        config = YAML::load_file(File.join(Rails.root, 'config', 'deploy.yml'))

        repo_url        = config['REPO_URL']
        branch_paths    = config['BRANCH_PATHS']
        github_ips      = config['GIT_IPS']

        commands = [
            #'cd app/assets/front-end/ && gulp',
            'sudo service apache2 reload'
        ]

        if !github_ips.include? request.remote_ip
            render plain: "Request is not from github"
            return
        end

        if !params['ref']
            render plain: "Not a valid payload"
            return
        end

        payload         = params
        remote_branch   = payload['ref'].split("/").last

        if payload['repository']['url'] != repo_url || !branch_paths.key?(remote_branch)
            render plain: "#{remote_branch} branch does not have any associated folder on server or repo is not correct"
            return
        end

        Dir.chdir(branch_paths[remote_branch]) do
            system 'git pull origin #{remote_branch}'
            commands.each do |command|
                system command
            end
        end
        
        render plain: "Successfully deployed on from branch `#{remote_branch}` into directory `#{ENV['HOME']}/#{branch_paths[remote_branch]}`"
    end
end
