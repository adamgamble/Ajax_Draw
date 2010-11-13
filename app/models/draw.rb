class Draw < ActiveRecord::Base
  scope :since, lambda { |date| where("draws.created_at > ?",date)}
end
