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

        payload = params

        if request.headers["X-GitHub-Event"] == 'pull_request' && request.request_parameters['action'] == 'closed'
            payload_branch   = payload['pull_request']['base']['ref']
            payload_url      = payload['pull_request']['head']['repo']['html_url']
        elsif request.headers["X-GitHub-Event"] == 'push'
            payload_branch   = payload['ref'].split("/").last
            payload_url      = payload['repository']['url']
        else
            render plain: "Only push and pull_request events are supported! #{request.request_parameters['action']}"
            return
        end

        if payload_url != repo_url || !branch_paths.key?(payload_branch)
            render plain: "#{payload_branch} branch does not have any associated folder on server or repo is not correct"
            return
        end

        Dir.chdir(branch_paths[payload_branch]) do
            system "git pull origin #{payload_branch}"
            commands.each do |command|
                system command
            end
        end
        
        render plain: "Successfully deployed on from branch `#{payload_branch}` into directory `#{branch_paths[payload_branch]}`"
    end
end
