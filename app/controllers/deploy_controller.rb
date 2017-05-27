class DeployController < ApplicationController

    skip_before_action :verify_authenticity_token

    def index

        repo = 'assist-software/hr-assist'
        github_ips = ['207.97.227.253', '50.57.128.197', '108.171.174.178', '50.57.231.61']

        branch_paths = {
            master: 'hr_assist',
            staging: 'hr_assist_staging'
        }

        commands = [
            #'cd app/assets/front-end/ && gulp',
            'sudo service apache2 reload'
        ]

        if !github_ips.include? request.remote_ip
            render plain: "Request is not from github"
            return
        end

        if !payload = params['payload']
            render plain: "Payload param does not exist"
            return
        end

        remote_branch = payload['ref'].split("/").last

        if payload['repository']['url'] != "https://github.com/#{repo}" || !branch_paths.key?(remote_branch.to_sym)
            render plain: "#{remote_branch} branch does not have any associated folder on server or repo is not correct"
            return
        end

        Dir.chdir(ENV['HOME'] + '/' +branch_paths[remote_branch.to_sym]) do
            system 'git pull origin #{remote_branch}'
            commands.each do |command|
                system command
            end
        end
        
        render plain: "Successfully deployed on from branch `#{remote_branch.to_sym}` into directory `#{ENV['HOME']}/#{branch_paths[remote_branch.to_sym]}`"
    end
end
