class Annotation < ApplicationRecord
  validates :status, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 10 }
  validates :user_id, uniqueness: { scope: :katagami_id }
  
  belongs_to :user
  belongs_to :katagami

  has_many :has_labels

  # アノテーション実行開始
  def self.stand_by(params)
    katagami = Katagami.find(params[:katagami])
    ant_params = {
      katagami: katagami,
      user: User.find(params[:user])
    }
    annotation = find_by(ant_params)

    if !annotation.present?
      annotation = create(ant_params)
      katagami.update(ant_num: katagami.ant_num + 1)
    end
    
    {
      id: annotation.id,
      katagami_url: katagami.presigned_url,
      katagami_width: katagami.width,
      katagami_height: katagami.height
    }
  end

  # アノテーション結果を保存
  def save_result(params)
    new_status = self.status

    HasLabel.transaction do
      # {has_labels: 'label_id [positions], label_id [positions]'}
      params[:has_labels].split(',').each do |has_label|
        self.add(has_label)
        new_status += 1
      end
    end
      self.update(status: new_status)
      self.has_labels
    rescue => e
      p e.message
      []
  end

  # 自身に紐付くHasLabel生成
  def add(has_label)
    _has_label = has_label.split(' ').map { |n| n.to_i }
    label = Label.find(_has_label.shift) # has_labelの先頭はlabel_id

    _has_label.each {|position|
      HasLabel.create(
        annotation: self, katagami: self.katagami, label: label, position: position
      )
    }
  end
end
