Campfire::Application.routes.draw do
  resources :rooms do
    member do
      post :message
    end
  end

  root :to => "home#index"

  resources :home do
    collection do
      get :server
    end
  end
end
