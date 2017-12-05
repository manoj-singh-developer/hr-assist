class AccessPolicy
  include AccessGranted::Policy

  def configure
    # Example policy for AccessGranted.
    # For more details check the README at
    #
    # https://github.com/chaps-io/access-granted/blob/master/README.md
    #
    # Roles inherit from less important roles, so:
    # - :admin has permissions defined in :member, :guest and himself
    # - :member has permissions from :guest and himself
    # - :guest has only its own permissions since it's the first role.
    #
    # The most important role should be at the top.
    # In this case an administrator.
    #
    # role :admin, proc { |user| user.admin? } do
    #   can :destroy, User
    # end

    # More privileged role, applies to registered users.
    #
    # role :member, proc { |user| user.registered? } do
    #   can :create, Post
    #   can :create, Comment
    #   can [:update, :destroy], Post do |post, user|
    #     post.author == user
    #   end
    # end

    # The base role with no additional conditions.
    # Applies to every user.
    #
    # role :guest do
    #  can :read, Post
    #  can :read, Comment
    # end


    role :admin, { is_admin: true } do
      can :manage, Activity
      can :manage, ApplicationType
      can :manage, Country
      can :manage, Customer
      can :manage, Department
      can :manage, Education
      can :manage, Certification
      can :manage, Device
      can :manage, HolidayReplacement
      can :manage, Industry
      can :manage, Language
      can :manage, Position
      can :manage, Holiday
      can :manage, Schedule
      can :manage, Technology
      can :manage, Training
      can :manage, Upload
      can :manage, Project
      can :manage, User
      can :manage, Candidate
      can :manage, HardwareComponent
      #can :view_project, Project
    end

    role :employee do
      can :read, User
      can :update, User
      can :read, Holiday
      can :create, Technology
    end
  end
end
