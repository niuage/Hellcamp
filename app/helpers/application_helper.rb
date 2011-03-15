module ApplicationHelper
  def stylesheet(*args)
    content_for(:head) { stylesheet_link_tag(*args.map(&:to_s) << {:media => 'all'}) }
  end

  def javascript(*args)
    args = args.map { |arg| arg == :defaults ? arg : arg.to_s }
    content_for(:javascripts) { javascript_include_tag(*args) }
  end
end
